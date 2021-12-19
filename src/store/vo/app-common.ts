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
  audioCommon: Audio; //当前播放音乐
  audioCommonList: Audio[]; //收藏的播放音乐
  localAudio: HTMLAudioElement; //当前audio对象
}
import { Howl } from 'howler';
export interface Audio {
  howl: Howl;
  name: string;
  src: string;
  tmpsrc: string;
  musicImgSrc: string;
  index: number;
}
