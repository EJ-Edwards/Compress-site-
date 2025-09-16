function compressImage(file, quality = 0.7, maxWidth = 1280) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const reader = new FileReader();
		reader.onload = (e) => {
			img.src = e.target.result;
		};
		img.onload = () => {
			const scale = Math.min(1, maxWidth / img.width);
			const canvas = document.createElement('canvas');
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			canvas.toBlob(
				(blob) => {
					resolve(blob);
				},
				'image/jpeg',
				quality
			);
		};
		img.onerror = reject;
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

async function compressVideo(file, mimeType = 'video/webm;codecs=vp9', quality = 0.7) {
	return file; 
}

document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('fileInput');
	const output = document.getElementById('output');
	if (!input) return;
	input.addEventListener('change', async (e) => {
		output.innerHTML = '';
		const files = e.target.files;
		for (let file of files) {
			let compressed;
			if (file.type.startsWith('image/')) {
				compressed = await compressImage(file);
			} else if (file.type.startsWith('video/')) {
				compressed = await compressVideo(file);
			} else {
				output.innerHTML += `<p>Unsupported file type: ${file.name}</p>`;
				continue;
			}
			output.innerHTML += `<p>${file.name}: Original ${(file.size/1024).toFixed(1)} KB, Compressed ${(compressed.size/1024).toFixed(1)} KB</p>`;
			const url = URL.createObjectURL(compressed);
			output.innerHTML += `<a href="${url}" download="compressed-${file.name}">Download compressed</a><br/>`;
		}
	});
});


