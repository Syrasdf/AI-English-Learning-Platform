/**
 * 校验 MIME 类型是否为常见图片格式
 * @param mimeType 要校验的 MIME 类型字符串
 * @returns 如果是图片 MIME 类型返回 true，否则返回 false
 */
export function isImageMimeType(mimeType: string): boolean {
  // 常见图片格式的 MIME 类型
  const imageMimeTypes = [
    'image/jpeg',      // .jpg, .jpeg
    'image/png',       // .png
    'image/webp',      // .webp
    'image/gif',       // .gif
    'image/svg+xml',   // .svg
    'image/bmp',       // .bmp
    'image/tiff',      // .tiff, .tif
    'image/x-icon',    // .ico
    'image/vnd.microsoft.icon' // .ico (另一种表示)
  ];

  // 检查传入的 MIME 类型是否在支持的图片类型列表中
  return imageMimeTypes.includes(mimeType.toLowerCase());
}