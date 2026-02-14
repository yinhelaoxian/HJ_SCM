package com.hjscm.service;

import com.hjscm.entity.*;
import com.hjscm.repository.*;
import com.hjscm.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 需求版本管理服务
 * 
 * 功能：
 * - 版本创建/对比/回滚/审批流
 */
@Service
public class DemandVersionService {

    @Autowired
    private DemandVersionRepository versionRepository;

    /**
     * 创建新版本
     */
    public DemandVersion createVersion(DemandVersionCreateRequest request) {
        String versionId = UUID.randomUUID().toString();
        String versionCode = generateVersionCode(request.getVersionType());
        
        DemandVersion version = DemandVersion.builder()
            .id(versionId)
            .code(versionCode)
            .type(request.getVersionType())
            .status("DRAFT")
            .createdBy(request.getUserId())
            .createdAt(LocalDateTime.now())
            .description(request.getDescription())
            .forecastData(request.getForecastData())
            .build();
        
        return versionRepository.save(version);
    }

    /**
     * 版本对比
     */
    public VersionCompareResult compare(String versionId1, String versionId2) {
        DemandVersion v1 = versionRepository.findById(versionId1).orElseThrow();
        DemandVersion v2 = versionRepository.findById(versionId2).orElseThrow();
        
        List<VersionDiff> diffs = new ArrayList<>();
        
        // 对比Forecast数据
        for (String key : v1.getForecastData().keySet()) {
            Double val1 = v1.getForecastData().get(key);
            Double val2 = v2.getForecastData().getOrDefault(key, 0.0);
            
            double change = val2 - val1;
            double changePercent = val1 > 0 ? change / val1 * 100 : 0;
            
            diffs.add(VersionDiff.builder()
                .key(key)
                .value1(val1)
                .value2(val2)
                .change(change)
                .changePercent(changePercent)
                .build());
        }
        
        return VersionCompareResult.builder()
            .version1(v1)
            .version2(v2)
            .diffs(diffs)
            .totalChanges(diffs.size())
            .significantChanges(diffs.stream().filter(d -> Math.abs(d.getChangePercent()) > 10).count())
            .build();
    }

    /**
     * 版本回滚
     */
    public DemandVersion rollback(String targetVersionId, String userId) {
        DemandVersion target = versionRepository.findById(targetVersionId).orElseThrow();
        
        DemandVersion newVersion = DemandVersion.builder()
            .id(UUID.randomUUID().toString())
            .code(generateVersionCode("ROLLBACK"))
            .type("ROLLBACK")
            .status("DRAFT")
            .rollbackFrom(target.getId())
            .rollbackAt(LocalDateTime.now())
            .forecastData(target.getForecastData())
            .createdBy(userId)
            .build();
        
        return versionRepository.save(newVersion);
    }

    /**
     * 审批流
     */
    public void submitForApproval(String versionId, String userId) {
        DemandVersion version = versionRepository.findById(versionId).orElseThrow();
        version.setStatus("PENDING_APPROVAL");
        version.setApprovalSubmitter(userId);
        version.setApprovalSubmittedAt(LocalDateTime.now());
        versionRepository.save(version);
    }

    /**
     * 审批
     */
    public void approve(String versionId, String approverId, String comment) {
        DemandVersion version = versionRepository.findById(versionId).orElseThrow();
        version.setStatus("APPROVED");
        version.setApprovedBy(approverId);
        version.setApprovedAt(LocalDateTime.now());
        version.setApprovalComment(comment);
        versionRepository.save(version);
    }

    private String generateVersionType) {
        return switch (LocalDateTime.now().getMonthValue()) {
            case 1 -> "JANUARY";
            case 2 -> "FEBRUARY";
            case 3 -> "MARCH";
            default -> "SNAPSHOT";
        };
    }
}
