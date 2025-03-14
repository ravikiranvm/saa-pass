import html2canvas from 'html2canvas';


export async function handle_share(scoreCard, result_percent) {
    try {
        // Hide buttons in the shareable image
        const buttons = scoreCard.querySelectorAll('button');
        buttons.forEach(button => button.style.visibility = 'hidden');

        const canvas = await html2canvas(scoreCard, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true
        });

        buttons.forEach(button => button.style.visibility = 'visible');

        canvas.toBlob(async (blob) => {
            const file = new File([blob], 'AWS-Exam-Readiness-2025.png', { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: 'AWS Exam Readiness',
                        text: "I've just checked my AWS Exam Readiness With 'The Cloud Squad'. Check yours now!",
                        url: 'https://thecloudsquad.com'
                    });
                } catch (error) {
                    if (error.name === 'AbortError') {
                        tryNativeShare(result_percent);
                    }
                }
            } else {
                if (navigator.share) {
                    tryNativeShare(result_percent);
                } else {
                downloadImage(canvas);
                }
            }
        },'image/png', 0.95);
    }
 

    catch (error) {
        tryNativeShare(result_percent);
    }
}

export function tryNativeShare(result_percent) {
    if (navigator.share) {
        navigator.share({
            title: 'AWS Exam Readiness',
            text: `I've just checked my AWS Exam Readiness With 'The Cloud Squad' and scored ${result_percent}%. Check yours now!`,
            url: 'https://thecloudsquad.com'
        })
    } else {
        alert('Sharing is not supported in this browser. Please take a screenshot and share it manually');
    }
}

export function downloadImage(canvas) {
    const link = document.createElement('a');
    link.download = 'AWS-Exam-Readiness-2025.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}