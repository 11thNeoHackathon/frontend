import { missionApi, type ChapterDetails } from '../missions/api'
export const chapterApi = {
  get: (id:string) => missionApi.getChapter(Number(id)) as Promise<ChapterDetails>,
  write: (id:number, input:{title:string;content:string;missionInstruction:string}) =>
    missionApi.writeStory(id,input),
  complete: (id:number) => missionApi.completeStory(id),
}
