export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  static async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch (e) {
        console.warn('SW registration failed', e);
      }
    }
  }

  static async showNotification(title: string, body: string) {
    const granted = await this.requestPermission();
    if (granted) {
      new Notification(title, { body, icon: '/favicon.svg' });
    }
  }
}
