export class NotificationService {
  static async register(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', reg.scope);
      } catch (err) {
        console.warn('SW registration failed:', err);
      }
    }
  }

  static async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) return 'denied';
    if (Notification.permission === 'granted') return 'granted';
    return await Notification.requestPermission();
  }

  static async showLocalNotification(title: string, body: string, type: string = 'info'): Promise<void> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') return;

    const icons: Record<string, string> = {
      alert: '🚨', warning: '⚠️', success: '✅', info: 'ℹ️'
    };
    
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(`${icons[type] || 'ℹ️'} ${title}`, {
        body,
        tag: `raga-${Date.now()}`,
        icon: '/icon-192.png',
      });
    } else {
      new Notification(`${icons[type] || 'ℹ️'} ${title}`, { body });
    }
  }

  static async triggerCriticalAlert(patientName: string, message: string): Promise<void> {
    await this.showLocalNotification(
      `⚡ CRITICAL: ${patientName}`,
      message,
      'alert'
    );
  }
}
