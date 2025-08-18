import { generateSlug } from "@/utils/useSupabase";
import Link from "next/link";
import { BlogPost, BlogImages } from "@/utils/useSupabase";

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

// Helper function to truncate content for preview
function truncateContent(content: string | null, maxLength: number = 150): string {
  if (!content) return '';
  const strippedContent = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
  if (strippedContent.length <= maxLength) return strippedContent;
  return strippedContent.substring(0, maxLength).trim() + '...';
}

interface BlogCardProps {
  post: BlogPost;
  firstImage?: BlogImages | null;
}

export default function BlogCard({ post, firstImage }: BlogCardProps) {
  const slug = generateSlug(post.title || '');

  return (
    <Link href={`/news/${slug}`} className="block">
      <div className="bg-[rgba(255,255,255,0.08)] rounded-xl border border-[rgba(140,198,63,0.2)] transition-all duration-300 overflow-hidden cursor-pointer hover:bg-[rgba(255,255,255,0.12)] hover:-translate-y-0.5 hover:shadow-[0_5px_20px_rgba(140,198,63,0.15)]">
        
        {/* Image or placeholder */}
        <div className="w-full h-[180px] bg-gradient-to-br from-[rgba(140,198,63,0.3)] to-[rgba(140,198,63,0.1)] flex items-center justify-center relative border-b border-[rgba(140,198,63,0.2)] md:h-[150px] max-[580px]:h-[120px]">
          {firstImage ? (
            <img 
              src={firstImage.image_url}
              alt={`${post.title} - blog image`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center">
              <div className="w-[50px] h-[50px] bg-[rgba(255,255,255,0.9)] rounded-full flex items-center justify-center text-xl text-[color:var(--lightgreen)] transition-all duration-300 shadow-[0_3px_15px_rgba(0,0,0,0.2)] hover:scale-110 hover:bg-white max-[580px]:w-[40px] max-[580px]:h-[40px] max-[580px]:text-base">
                📰
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-2">
            <h4 className="text-[color:var(--lightgreen)] text-[clamp(14px,1.2vw,16px)] font-semibold flex-1 pr-2">
              {post.title}
            </h4>
            {post.created_at && (
              <div className="text-right text-[clamp(10px,0.9vw,12px)] opacity-70 min-w-fit mt-2">
                <div className="font-medium text-[color:var(--lightgreen)]">{formatDate(post.created_at)}</div>
              </div>
            )}
          </div>
          
          {post.content && (
            <p className="text-[clamp(12px,1vw,14px)] leading-snug opacity-85 mb-3 line-clamp-3 overflow-hidden">
              {truncateContent(post.content)}
            </p>
          )}
          
          <span className="inline-block bg-[rgba(140,198,63,0.2)] text-[color:var(--lightgreen)] py-1 px-2 rounded-md text-[clamp(10px,0.9vw,12px)] font-medium">
            News Article
          </span>
        </div>
      </div>
    </Link>
  );
}
