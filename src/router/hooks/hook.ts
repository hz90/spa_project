import { songDetailStoreModule } from '@/store/modules/song-detail-store';
/* eslint-disable */
import {
    SongDetailRequestVo,
    SongDetailStoreVo,
} from '@/store/vo/music-song-detail-vo';
import { SongStoreVo } from '@/store/vo/music-song-vo';
import { appCommonStoreModule } from '@/store/modules/app-common-store';
import { AppCommon, Audio } from '@/store/vo/app-common';
/**
 * 路由钩子函数
 */
/* eslint-disable */
export default class Hooks {
    public static hook(router: any): void {
        router.beforeEach((to: any, from: any, next: any) => {
            this.rootBeforeEach(to, from, next);
        });

        router.afterEach((to: any, from: any) => {
            console.log('全局后置守卫');
        });
    }

    private static rootBeforeEach(to: any, from: any, next: any): any {
        console.log('全局前置守卫');
        console.log(to);
        console.log(from);
        console.log(next);
        // if (to.name == "MusicList") {
        //     console.log('全局前置守卫 init');
        //     this.audioCommm(to);
        // }
        // Promise.all([this.audioCommm(to)]).then(() => {
        //     next();
        // }).finally();
        next();
    }
    private static async audioCommm(to: any): Promise<any> {
        if (to.name != "MusicList") {
            console.log('全局前置守卫 init');
            return;
        }
        let audioCommon: Audio = Object.create(null) as Audio;
        let appCommon: AppCommon = Object.create(null) as AppCommon;
        //let audioCommon = appCommonStoreModule.getAppCommon.audioCommon;
        let songStoreVo: SongStoreVo = {
            name: '夜曲',
            msrc: '6Q0Pd53mojY',
            psrc: 'https://i.ytimg.com/vi/6Q0Pd53mojY/hqdefault.jpg',
            tmpsrc: "",
        };
        audioCommon.name = songStoreVo.name;
        audioCommon.musicImgSrc = songStoreVo.psrc;
        let musicDetail = await this.getMusicDetail(songStoreVo);
        audioCommon.src = musicDetail;
        appCommon.audioCommon = audioCommon;
        console.log("first init " + JSON.stringify(appCommon));
        appCommonStoreModule.setAppCommon(appCommon);
    }
    private static async getMusicDetail(songStoreVos: SongStoreVo): Promise<string> {
        let songDetailRequestVo: SongDetailRequestVo = Object.create(
            null
        ) as SongDetailRequestVo;
        songDetailRequestVo = Object.assign(songDetailRequestVo, songStoreVos);
        let songDetailRequestVos: SongDetailRequestVo[] = [];
        songDetailRequestVos.push(songDetailRequestVo);
        await songDetailStoreModule.exeGetSongsDetailApi(songDetailRequestVos);
        let songDetailStoreVo: SongDetailStoreVo[] =
            songDetailStoreModule.getSongsDetail;
        if (songDetailStoreVo && songDetailStoreVo.length > 0) {
            return songDetailStoreVo[0].msrc;
        } else {
            return '';
        }
    }
}
