import { FiStar } from "react-icons/fi";

export default function RatingStars({ value = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FiStar
        key={i}
        className={
          "w-3 h-3 " +
          (i <= Math.round(value) ? "text-yellow-400 fill-yellow-400" : "text-slate-300")
        }
      />
    );
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
}
