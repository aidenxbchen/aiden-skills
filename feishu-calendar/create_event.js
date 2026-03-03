const axios = require("axios");

// === input params start
const appID = process.env.APP_ID; // app_id, required, 应用 ID
const appSecret = process.env.APP_SECRET; // app_secret, required, 应用 secret  
const userAccessToken = process.env.USER_ACCESS_TOKEN; // uat, required, 用户访问令牌
const summary = process.env.SUMMARY; // string, required, 会议标题
const startTime = process.env.START_TIME; // string, required, 开始时间戳
const endTime = process.env.END_TIME; // string, required, 结束时间戳
const description = process.env.DESCRIPTION; // string, optional, 会议描述
const timezone = process.env.TIMEZONE || "Asia/Shanghai"; // string, optional, 时区
// === input params end

// 把错误信息和排查建议打印出来，方便排查
function axiosErrorLog(response) {
  const data = response?.data;
  if (data?.error) {
    console.error("Error:", data);
  }
}

// 获取主日历ID
async function getPrimaryCalendarID(userAccessToken) {
  const url = `https://open.feishu.cn/open-apis/calendar/v4/calendars/primary?user_id_type=open_id`;
  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json; charset=utf-8",
  };
  
  try {
    console.log("POST:", url);
    const response = await axios.post(url, {}, { headers });
    const result = response.data;
    if (result.code !== 0) {
      console.error("ERROR: 获取主日历信息失败", result);
      throw new Error(`failed to get primary calendar: ${result.msg}`);
    }
    if (!result.data || !result.data.calendars || result.data.calendars.length === 0) {
      throw new Error("未获取到主日历信息");
    }
    const calendarID = result.data.calendars[0].calendar.calendar_id;
    console.log("获取主日历ID成功:", calendarID);
    return calendarID;
  } catch (error) {
    axiosErrorLog(error.response);
    throw new Error(`Error getting primary calendar ID: ${error.message}`);
  }
}

// 创建日程
async function createEvent(userAccessToken, calendarID, summary, startTime, endTime, description, timezone) {
  const url = `https://open.feishu.cn/open-apis/calendar/v4/calendars/${encodeURIComponent(calendarID)}/events?user_id_type=open_id`;
  
  // 验证必需参数
  if (!startTime || !endTime) {
    throw new Error("创建日程需要提供 START_TIME 和 END_TIME 环境变量");
  }
  if (!summary) {
    throw new Error("创建日程需要提供 SUMMARY 环境变量");
  }
  
  const payload = {
    summary: summary,
    start_time: {
      timestamp: startTime,
      timezone: timezone
    },
    end_time: {
      timestamp: endTime,
      timezone: timezone
    }
  };
  
  if (description) {
    payload.description = description;
  }
  
  const headers = {
    Authorization: `Bearer ${userAccessToken}`,
    "Content-Type": "application/json; charset=utf-8",
  };
  
  try {
    console.log("POST:", url);
    console.log("请求参数:", JSON.stringify(payload, null, 2));
    const response = await axios.post(url, payload, { headers });
    const result = response.data;
    if (result.code !== 0) {
      console.error("ERROR: 创建日程失败", result);
      throw new Error(`failed to create event: ${result.msg}`);
    }
    console.log("日程创建成功:", result.data.event.event_id);
    console.log("日程链接:", result.data.event.app_link);
    return result.data.event;
  } catch (error) {
    axiosErrorLog(error.response);
    throw new Error(`Error creating event: ${error.message}`);
  }
}

async function main() {
  try {
    console.log("开始创建日程");
    
    // 验证必需的环境变量
    if (!appID) {
      throw new Error("缺少必需的环境变量 APP_ID");
    }
    if (!appSecret) {
      throw new Error("缺少必需的环境变量 APP_SECRET");
    }
    if (!userAccessToken) {
      throw new Error("缺少必需的环境变量 USER_ACCESS_TOKEN");
    }
    
    // 获取主日历ID
    const calendarID = await getPrimaryCalendarID(userAccessToken);
    
    // 创建事件
    await createEvent(userAccessToken, calendarID, summary, startTime, endTime, description, timezone);
    
    console.log("日程创建完成");
  } catch (error) {
    console.error("ERROR:", error.message);
    process.exit(1);
  }
}

main();