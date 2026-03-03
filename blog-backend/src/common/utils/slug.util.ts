export const buildSlug = (input: string): string => {
    if (!input) return "";

    return (
    input
      .toLowerCase()
      .trim()
      // إزالة التشكيل العربي
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // استبدال أي شيء مش حرف عربي أو لاتيني أو رقم بمسافة
      .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
      // استبدال المسافات بشرطة
      .replace(/\s+/g, '-')
      // إزالة الشرطات المتكررة
      .replace(/-+/g, '-')
      // إزالة الشرطات من البداية والنهاية
      .replace(/^-|-$/g, '')
  );
};