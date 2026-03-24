export function formatDueDate(dateStr?: string): { text: string; isDanger: boolean; isWarning: boolean } {
  if (!dateStr) return { text: '', isDanger: false, isWarning: false };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Parse YYYY-MM-DD reliably
  const parts = dateStr.includes('T') ? dateStr.split('T')[0].split('-') : dateStr.split('-');
  if (parts.length < 3) return { text: dateStr, isDanger: false, isWarning: false };
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  
  const targetDate = new Date(year, month, day);
  
  const diffTime = targetDate.getTime() - today.getTime();
  // We use round because daylight savings can sometimes cause floating diffs when dividing
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return { text: 'Due Today', isDanger: false, isWarning: true };
  } else if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    if (overdueDays > 7) {
      return { text: `${overdueDays} days overdue`, isDanger: true, isWarning: false };
    } else {
      // Just red-colored date
      const text = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return { text, isDanger: true, isWarning: false };
    }
  } else {
    // Future date
    const text = targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return { text, isDanger: false, isWarning: false };
  }
}
