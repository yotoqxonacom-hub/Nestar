import Link from 'next/link';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { BoardArticle } from '../../types/board-article';
import { categoryLabel, formatDate, isRealImage, parseArtKey } from '../../utils';
import FurnitureArt from './FurnitureArt';

const ArticleCard = ({ article, compact = false }: { article: BoardArticle; compact?: boolean }) => {
	const art = parseArtKey(article.articleImage);
	return (
		<Link href={`/community/detail?id=${article._id}`} className={`article-card ${compact ? 'compact' : ''}`}>
			<div className="img">
				{isRealImage(article.articleImage) ? (
					<img src={article.articleImage} alt="" />
				) : (
					<FurnitureArt type={art.type} color={art.color} variant={2} />
				)}
				<span className="cat">{categoryLabel[article.articleCategory]}</span>
			</div>
			<div className="body">
				<span className="date">
					{formatDate(article.createdAt)} · {article.memberData?.memberFullName}
				</span>
				<strong>{article.articleTitle}</strong>
				{!compact && <p>{article.articleContent}</p>}
				<div className="stats">
					<span>
						<RemoveRedEyeOutlinedIcon /> {article.articleViews}
					</span>
					<span>
						<FavoriteBorderIcon /> {article.articleLikes}
					</span>
					<span>
						<ChatBubbleOutlineIcon /> {article.articleComments}
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ArticleCard;
