import Link from 'next/link';
import { HeadGroup } from '@/app/ui/HeadGroup';
import { Heading } from '@/app/ui/Heading';
import { LinkButton } from '@/app/ui/LinkButton';
import { RecipeCard } from '@/app/ui/RecipeCard';
import { Section } from '@/app/ui/Section';
import { getSurveys } from '@/app/services/getSurveys';
import styles from './style.module.css';

export async function TopSurveys() {
    const data = await getSurveys();
    return (
        <Section>
            <HeadGroup>
                <Heading level={2} size='small'>
                    Categories
                </Heading>
                <LinkButton href='/categories' size='small' color='white'>
                    カテゴリー一覧
                </LinkButton>
            </HeadGroup>
            <div className={styles.cardContainer}>
                {data.categories?.map((category) => (
                        <Link href={process.env.NEXT_PUBLIC_API_URL + `/api/categories/${category.name}`} key={category.id}>
                            <RecipeCard
                                imageUrl={category.imageUrl}
                                title={category.label}
                                size='small'
                                ratio='square'
                                rounded={false}
                            />
                        </Link>
                    )
                )}
            </div>
        </Section>
    );
}