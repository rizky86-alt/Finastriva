import { Calendar } from "lucide-react";

interface ArticleCardProps {
  title: string;
  date: string;
  description: string;
  emoji?: string;
}

const ArticleCard = ({ title, date, description, emoji = "📰" }: ArticleCardProps) => {
  return (
    <div className="group bg-gray-900/40 backdrop-blur-md border border-gray-800 rounded-[2rem] overflow-hidden shadow-lg hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-2">
      <div className="h-48 bg-gray-900/60 flex items-center justify-center border-b border-gray-800 group-hover:bg-blue-600/10 transition-colors">
        <span className="text-6xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_10px_rgba(37,99,235,0.2)]">{emoji}</span>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">
          <Calendar className="h-3.5 w-3.5 text-blue-500" />
          <span>{date}</span>
        </div>
        <h3 className="text-lg font-black text-white mb-3 group-hover:text-blue-500 transition-colors leading-tight uppercase italic tracking-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed font-medium line-clamp-3">{description}</p>
      </div>
    </div>
  );
};

export default ArticleCard;
