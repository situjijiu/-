import md5 from 'md5';

/**
 * 获取Gravatar头像URL
 * @param email - 用户邮箱
 * @param size - 头像尺寸
 * @returns 头像URL
 */
export function getGravatarUrl(email: string, size: number = 200): string {
  if (!email) return '';
  const hash = md5(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=${size}`;
}

/**
 * 统一获取用户头像URL
 * @param user - 用户对象
 * @param size - 头像尺寸
 * @returns 头像URL
 */
export function getAvatarUrl(user: any, size: number = 200): string {
  // 优先使用用户自定义头像
  if (user && user.avatar) {
    return user.avatar;
  }
  
  // 其次使用Gravatar（基于邮箱）
  if (user && user.email) {
    return getGravatarUrl(user.email, size);
  }
  
  // 最后使用默认头像
  return '';
}
