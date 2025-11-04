import { Share2, Twitter, Facebook, Linkedin } from 'lucide-react';

const SocialShare = ({ url, title }) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: <Twitter className="w-5 h-5" />,
      color: 'hover:bg-blue-400/10 hover:text-blue-500',
      label: 'Share on Twitter'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: <Facebook className="w-5 h-5" />,
      color: 'hover:bg-blue-600/10 hover:text-blue-600',
      label: 'Share on Facebook'
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: <Linkedin className="w-5 h-5" />,
      color: 'hover:bg-blue-700/10 hover:text-blue-700',
      label: 'Share on LinkedIn'
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500">Share:</span>
      <div className="flex items-center gap-2">
        {shareLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full transition-colors duration-200 ${social.color} text-gray-600`}
            aria-label={social.label}
          >
            {social.icon}
          </a>
        ))}
        {navigator.share && (
          <button
            onClick={handleNativeShare}
            className="p-2 rounded-full transition-colors duration-200 hover:bg-gray-100 text-gray-600"
            aria-label="Share via native share dialog"
          >
            <Share2 className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SocialShare;
