export class UID {
  static getProfileUserId(): Promise<string> {
    return new Promise(resolve => {
      chrome.identity.getProfileUserInfo(userInfo => {
        resolve(userInfo.id);
      });
    });
  }
}