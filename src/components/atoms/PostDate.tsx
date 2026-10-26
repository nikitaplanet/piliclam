type PostDateProps = {
	value: string;
	className?: string;
};

export default function PostDate({value, className = 'text-sm text-gray-500'}: PostDateProps) {
	return (
		<time className={className} dateTime={value}>
			{new Date(value).toLocaleDateString('zh-TW', {
				timeZone: 'Asia/Taipei',
			})}
		</time>
	);
}
