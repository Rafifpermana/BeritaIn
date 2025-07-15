import React from "react";

const generateAvatarColor = (name) => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-sky-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const UserAvatar = ({ name, size = "w-10 h-10" }) => {
  const initials = getInitials(name);
  const bgColor = generateAvatarColor(name || "User");

  return (
    <div
      className={`${size} rounded-full ${bgColor} flex items-center justify-center text-white font-bold text-base shadow-md`}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
