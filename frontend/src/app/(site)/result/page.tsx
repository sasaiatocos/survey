import { unstable_cache } from 'next/cache';
import { notFound } from 'next/navigation';
import { SITE_NAME } from '@/constants';
import { getPhoto } from "@/services/getPhoto";
import { getPhotoLike } from "@/services/getPhotoLike";
import { PhotoComment } from "./_components/PhotoComment";
import { PhotoHero } from "./_components/PhotoHero";
import { PhotoMeta } from "./_components/PhotoMeta";
import styles from "./style.module.css";
import type { Metadata } from "next";

type Props = {
  params: { photoId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { photo } = await getPhoto({ id: params.photoId });
  if (!photo) {
    notFound();
  }
  return {
    title: `${photo.title} | ${SITE_NAME}`,
    description: photo.description,
  };
}

export default async function Page({ params }: Props) {
  const [session, { photo }] = await Promise.all([
    getPhoto({ id: params.photoId }),
  ]);
  if (!photo) {
    notFound();
  }
  const [author, { category }, { liked }] = await Promise.all([
    // ★1: unstable_cache で fetch 関数のように Data キャッシュを使用する
    unstable_cache(
      (id: string) => {
        return prisma.user.findUnique({
          where: { id },
          select: {
            id: true,
            name: true,
            image: true,
            profile: { select: { screenName: true } },
          },
        });
      },
      [`user/${photo.authorId}`],
      { tags: [`users/${photo.authorId}`] }
    )(photo.authorId),
    getCategoryById({ id: photo.categoryId }),
    ...(session?.user.id
      ? [getPhotoLike({ userId: session.user.id, photoId: photo.id })]
      : [{ liked: false }]),
  ]);
  if (!author) {
    notFound();
  }
  // 【6】ログインユーザー自身の投稿か否か
  const userId = session?.user.id;
  const isOwner = userId === author.id;
  return (
    <>
      <PhotoHero photo={photo} isOwner={isOwner} liked={liked} />
      <div className={styles.content}>
        <PhotoMeta
          photo={photo}
          category={category}
          author={author}
          isOwner={isOwner}
        />
        <PhotoComment photo={photo} userId={userId} />
      </div>
    </>
  );
}

// ★2: このページの fetch関数はデフォルトで`{ cache: "force-cache" }`とする
export const fetchCache = "force-cache";