import axios from 'axios';

const BASE_URL = '/api/scm'; // 假设的后端 API 地址

export const fetchControlTowerData = async () => {
  try {
    const response = await axios.get();
    return response.data;
  } catch (error) {
    console.error('Error fetching control tower data:', error);
    throw error;
  }
};

export const fetchThreeLinesOfDefenseData = async () => {
  try {
    const response = await axios.get();
    return response.data;
  } catch (error) {
    console.error('Error fetching three lines of defense data:', error);
    throw error;
  }
};

export const fetchISCProcessData = async () => {
  try {
    const response = await axios.get();
    return response.data;
  } catch (error) {
    console.error('Error fetching ISC process data:', error);
    throw error;
  }
};

export const fetchRiskEvents = async () => {
  try {
    const response = await axios.get();
    return response.data;
  } catch (error) {
    console.error('Error fetching risk events:', error);
    throw error;
  }
};
