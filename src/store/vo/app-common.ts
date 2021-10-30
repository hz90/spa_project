/**
 * 音乐
 */
export interface AppCommon {
  isShowIndex: boolean; //
  isPlaying: boolean; //
  isAnimation: boolean; //
  isShowAsideMenu: boolean; //显示侧边栏
  isShowMiniMusic: boolean; //
  isShowAbout: boolean; //显示关于界面
  audioCommon: Audio; //播放音乐
  localAudio: HTMLAudioElement; //当前audio对象
}

export interface Audio {
  name: string;
  src: string;
  musicImgSrc: string;
  index: number;
}
