import React, { useState } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import FurnitureArt from '../../libs/components/common/FurnitureArt';
import ArticleCard from '../../libs/components/common/ArticleCard';
import { Avatar } from '../../libs/components/common/AgentCard';
import { articles, findArticle, users } from '../../libs/data/mock';
import { categoryLabel, formatDate, parseArtKey } from '../../libs/utils';
import { userVar } from '../../apollo/store';

interface LocalComment {
	id: string;
	name: string;
	text: string;
	date: string;
}

/** Nestar: community/detail — maqola, like va izohlar (CommentGroup.ARTICLE) */
const ArticleDetail: NextPage = () => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const article = findArticle(router.query.id);
	const [liked, setLiked] = useState(false);
	const [text, setText] = useState('');
	const [comments, setComments] = useState<LocalComment[]>([
		{ id: 'x1', name: users[1].memberFullName as string, text: "Foydali maslahat, rahmat! Men ham shunday qilgandim.", date: '2026-09-24T00:00:00Z' },
		{ id: 'x2', name: users[3].memberFullName as string, text: "Rang tanlash bo'yicha ham yozsangiz yaxshi bo'lardi.", date: '2026-09-23T00:00:00Z' },
	]);

	if (!article) {
		return (
			<div className="article-detail container empty-list">
				<strong>{router.isReady ? 'Maqola topilmadi' : 'Yuklanmoqda…'}</strong>
				<Link href="/community" className="btn-dark">
					Hamjamiyatga qaytish
				</Link>
			</div>
		);
	}

	const art = parseArtKey(article.articleImage);
	const more = articles.filter((a) => a._id !== article._id).slice(0, 3);

	return (
		<div className="article-detail">
			<div className="container col">
				<article className="article-body">
					<span className="cat">{categoryLabel[article.articleCategory]}</span>
					<h2>{article.articleTitle}</h2>
					<div className="author">
						<Avatar member={article.memberData} size={44} />
						<div>
							<b>{article.memberData?.memberFullName}</b>
							<span>{formatDate(article.createdAt)}</span>
						</div>
						<span className="views">
							<RemoveRedEyeOutlinedIcon /> {article.articleViews}
						</span>
					</div>
					<div className="cover">
						<FurnitureArt type={art.type} color={art.color} variant={2} />
					</div>
					<p>{article.articleContent}</p>
					<p>
						Savollaringiz bo'lsa, izohlarda yozing — hamjamiyat a'zolari va sotuvchilar javob berishadi. Mahsulot tanlashda
						yordam kerak bo'lsa, <Link href="/cs?tab=inquiry">yordam markaziga</Link> murojaat qiling.
					</p>
					<button className={`like-btn ${liked ? 'on' : ''}`} onClick={() => setLiked(!liked)}>
						{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />} {article.articleLikes + (liked ? 1 : 0)}
					</button>
				</article>

				<section className="comments">
					<h3>Izohlar ({comments.length})</h3>
					{user?._id ? (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								if (!text.trim()) return;
								setComments([
									{ id: `c${Date.now()}`, name: (user.memberFullName || user.memberNick) as string, text: text.trim(), date: '2026-09-25T00:00:00Z' },
									...comments,
								]);
								setText('');
							}}
						>
							<textarea id="article-comment" placeholder="Fikringizni yozing" value={text} onChange={(e) => setText(e.target.value)} />
							<button className="btn-dark" type="submit" disabled={!text.trim()}>
								Yuborish
							</button>
						</form>
					) : (
						<div className="login-hint">
							Izoh yozish uchun <Link href="/account/join">tizimga kiring</Link>.
						</div>
					)}
					{comments.map((c) => (
						<div className="comment" key={c.id}>
							<Avatar member={{ memberFullName: c.name }} size={40} />
							<div>
								<b>{c.name}</b> <span>{formatDate(c.date)}</span>
								<p>{c.text}</p>
							</div>
						</div>
					))}
				</section>

				<section className="more-articles">
					<h3>Boshqa maqolalar</h3>
					<div className="article-grid">
						{more.map((a) => (
							<ArticleCard key={a._id} article={a} />
						))}
					</div>
				</section>
			</div>
		</div>
	);
};

export default withLayoutBasic(ArticleDetail);
