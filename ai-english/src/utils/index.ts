export function setValueToLocalStorage(key: string, value: unknown) {
  if (typeof value === 'object') {
    try {
      value = JSON.stringify(value) as string
    } catch {
      value = Object.prototype.toString.call(value)
    }
  } else {
    value += ''
  }
  localStorage.setItem(key, value as string)
}

export function clearLocalStorage(omit?: string[]) {
  const len = localStorage.length
  const removeList = []
  for (let i = 0; i < len; i++) {
    let key = localStorage.key(i) as string

    if (!omit || !omit.includes(key)) {
      removeList.push(key)
    }
  }
  console.log(removeList)
  for (let key of removeList) {
    localStorage.removeItem(key)
  }
}

export function startViewTransition(callback: () => any, finishFn?: () => any) {
  if (document.startViewTransition !== undefined) {
    document.startViewTransition(callback).finished.then(() => {
      finishFn && finishFn()
    })
  } else {
    callback()
  }
}

export function getTimeStatus(timestamp: number): number {
  // 获取当前时间
  const now = new Date();
  const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  
  // 计算输入时间戳对应的日期
  const inputDate = new Date(timestamp);
  const inputDayStart = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate()).getTime();
  
  // 计算天数差
  const dayDiff = (nowDayStart - inputDayStart) / (1000 * 60 * 60 * 24);
  
  if (dayDiff === 0) {
      // 今天
      return 0;
  } else if (dayDiff === 1) {
      // 昨天
      return 1;
  } else if (dayDiff > 1 && dayDiff <= 7) {
      // 7天内
      return 2;
  } else {
      // 更早
      return 3;
  }
}

interface SSEMessage {
  data: string;
  event: string | null;
  id: string | null;
  retry: number | null;
}

export function parseSSEMessage(message: string): SSEMessage {
  const lines = message.split('\n');
  const event: SSEMessage = {
    data: '',
    event: null,
    id: null,
    retry: null
  };
  
  const dataParts: string[] = [];
  
  lines.forEach(line => {
    if (line.startsWith('data:')) {
      dataParts.push(line.substring(5).trim());
    } else if (line.startsWith('event:')) {
      event.event = line.substring(6).trim();
    } else if (line.startsWith('id:')) {
      event.id = line.substring(3).trim();
    } else if (line.startsWith('retry:')) {
      const retryValue = line.substring(6).trim();
      const retryNumber = parseInt(retryValue, 10);
      if (!isNaN(retryNumber)) {
        event.retry = retryNumber;
      }
    }
    // 忽略注释行（以:开头）
  });
  
  // 合并所有data行
  event.data = dataParts.join('\n');
  
  return event;
}

/**
 * 获取用户当前选择的文本
 * @returns 返回用户选择的文本，如果没有选择则返回空字符串
 */
export function getSelectedText(): string {
  // 标准方式：使用 window.getSelection()
  if (window.getSelection) {
    return window.getSelection()?.toString() || '';
  }
  
  // 兼容旧版IE的方式
  if (document.getSelection) {
    return document.getSelection()?.toString() || '';
  }
  
  // 更旧版本的IE
  if ((document as any).selection) {
    return ((document as any).selection.createRange() as any).text || '';
  }
  
  return '';
}

/**
 * 判断当前是否处于移动设备环境
 * @returns {boolean} 如果是移动设备返回 true，否则返回 false
 */
export function isMobileDevice(): boolean {
  // 通过用户代理字符串检测
  const userAgent = navigator.userAgent.toLowerCase();
  
  // 常见移动设备关键字
  const mobileKeywords = [
      'android', 
      'iphone', 
      'ipod', 
      'ipad', 
      'windows phone', 
      'blackberry', 
      'opera mini', 
      'iemobile', 
      'mobile'
  ];
  
  // 检查用户代理是否包含任何移动设备关键字
  const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword));
  
  // 额外检查触摸支持（可选）
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // 如果屏幕宽度小于768px也认为是移动设备（可选）
  const isSmallScreen = window.innerWidth < 768;
  
  // 综合判断：用户代理匹配 或 有触摸支持且是小屏幕
  return isMobile || (hasTouch && isSmallScreen);
}