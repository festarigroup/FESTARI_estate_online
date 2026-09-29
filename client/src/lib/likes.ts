const LIKER_NAME_POOL = [
  "Kwame", "Ama Boateng", "Kojo Mensah", "Efua Owusu", "Kwabena Asante",
  "Akosua Darko", "Yaw Agyeman", "Abena Sarpong", "Kofi Appiah", "Adjoa Nkrumah",
];

/** Deterministic stand-in liker names — there's no real likes backend yet
 * (see PostCard/ProjectUpdateCard's "Liked by" row + LikesBottomSheet). */
export function buildLikerNames(count: number): string[] {
  return Array.from({ length: count }, (_, index) => LIKER_NAME_POOL[index % LIKER_NAME_POOL.length]);
}
