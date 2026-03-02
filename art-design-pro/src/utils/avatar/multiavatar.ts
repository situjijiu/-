
import multiavatar from '@multiavatar/multiavatar';
import path from 'path';
import fs from 'fs';
// const svgCode = multiavatar('你的唯一标识'); // 如用户ID、邮箱
/**
 * 生成用户头像
 * @returns 头像图片名
 */
export function generateAvatar(username: string): string {

  // 生成用户头像
  const svgCode = multiavatar(username); // 如用户ID、邮箱
  // 保存 SVG 代码到文件
  const avatarName = `${username}.svg`
  // 保存 SVG 代码到文件
  fs.writeFileSync(path.join(__dirname, '/src/assets/images/avatar', avatarName), svgCode);
  // 返回头像图片名
  return avatarName
}

/**
 * 获取头像完整路径
 * @param avatarName 头像图片名
 * @returns 头像完整路径
 */
export function getAvatarPath(avatarName: string): string {
  return `/src/assets/images/avatar/${avatarName}.svg`
}