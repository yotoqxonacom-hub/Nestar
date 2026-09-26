import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ArticleCard from '../../libs/components/common/ArticleCard';
import { articles as seed } from '../../libs/data/mock';
import { BoardArticleCategory, BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { BoardArticle } from '../../libs/types/board-article';
import { categoryLabel } from '../../libs/utils';
import { userVar } from '../../apollo/store';

const CATS = [BoardArticleCategory.FREE, BoardArticleCategory.RECOMMEND, BoardArticleCategory.NEWS, BoardArticleCategory.INTERIOR];

/** Nestar: community/index — BoardArticle ro'yxati va yangi maqola yozish */
const Community: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [list, setList] = useState<BoardArticle[]>(seed);
	const [writing, setWriting] = useState(false);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const category = (router.query.articleCategory as BoardArticleCategory) || BoardArticleCategory.FREE;

	useEffect(() => {
		if (router.query.write) setWriting(true);
	}, [router.query.write]);

	const shown = list.filter((a) => a.articleCategory === category);
	const setCat = (c: BoardArticleCategory) => router.push(`/community?articleCategory=${c}`, undefined, { shallow: true });

	const publish = (e: React.FormEvent) => {
		e.preventDefault();
		const now = new Date(Date.UTC(2026, 8, 25)).toISOString();
		setList([
			{
				_id: `local-${Date.now()}`,
				articleCategory: category,
				articleStatus: BoardArticleStatus.ACTIVE,
				articleTitle: title,
				articleContent: content,
				articleImage: 'ARMCHAIR:#c9a27a',
				articleViews: 0,
				articleLikes: 0,
				articleComments: 0,
				memberId: user._id as string,
				createdAt: now,
				updatedAt: now,
				memberData: user as BoardArticle['memberData'],
			},
			...list,
		]);
		setTitle('');
		setContent('');
		setWriting(false);
	};

	return (
		<div className="community-page">
			<div className="container">
				<aside className="community-menu">
					<strong>Categories</strong>
					{CATS.map((c) => (
						<button key={c} className={category === c ? 'active' : ''} onClick={() => setCat(c)}>
							{categoryLabel[c]}
							<em>{list.filter((a) => a.articleCategory === c).length}</em>
						</button>
					))}
					{user?._id && (
						<button className="write" onClick={() => setWriting(!writing)}>
							<EditOutlinedIcon /> Write an article
						</button>
					)}
				</aside>
				<section className="community-list">
					<div className="list-head">
						<h2>{categoryLabel[category]}</h2>
						<span>{shown.length} articles</span>
					</div>
					{writing && (
						<form className="write-form" onSubmit={publish}>
							<div className="form-field">
								<label htmlFor="art-title">Title</label>
								<input id="art-title" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. How do I clean a velvet sofa?" />
							</div>
							<div className="form-field">
								<label htmlFor="art-content">Content</label>
								<textarea id="art-content" required value={content} onChange={(e) => setContent(e.target.value)} />
							</div>
							<div className="row">
								<span>Category: {categoryLabel[category]}</span>
								<button type="submit" className="btn-accent">
									Publish
								</button>
							</div>
						</form>
					)}
					{shown.length === 0 ? (
						<div className="empty-list">
							<strong>No articles in this category yet</strong>
						</div>
					) : (
						<div className="article-grid">
							{shown.map((a) => (
								<ArticleCard key={a._id} article={a} />
							))}
						</div>
					)}
				</section>
			</div>
		</div>
	);
};

export default withLayoutBasic(Community);
