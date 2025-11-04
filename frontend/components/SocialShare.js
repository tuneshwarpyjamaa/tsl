// components/SocialShare.js
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const SocialShare = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-semibold">Share:</span>
      <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
        <Twitter size={20} />
      </a>
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-600">
        <Facebook size={20} />
      </a>
      <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-700">
        <Linkedin size={20} />
      </a>
    </div>
  );
};

export default SocialShare;
