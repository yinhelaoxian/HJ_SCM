const puppeteer = require('puppeteer');

async function verifyPage() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('正在访问页面...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    
    // 等待 React 渲染完成
    await page.waitForSelector('#root', { timeout: 10000 });
    
    // 检查页面内容
    const content = await page.content();
    const hasContent = content.includes('豪江智能') || content.includes('Dashboard');
    
    // 截图
    await page.screenshot({ path: '/tmp/hj-scm-screenshot.png' });
    console.log('截图已保存到 /tmp/hj-scm-screenshot.png');
    
    // 检查控制台错误
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    
    // 检查页面是否渲染了内容
    const rendered = await page.evaluate(() => {
      const root = document.getElementById('root');
      return root && root.children.length > 0;
    });
    
    console.log('页面渲染成功:', rendered);
    console.log('页面包含预期内容:', hasContent);
    
    if (errors.length > 0) {
      console.log('控制台错误:', errors);
    } else {
      console.log('无控制台错误');
    }
    
    await browser.close();
    process.exit(rendered && hasContent ? 0 : 1);
  } catch (error) {
    console.error('验证失败:', error.message);
    await browser.close();
    process.exit(1);
  }
}

verifyPage();
