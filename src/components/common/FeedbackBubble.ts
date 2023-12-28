import { fabric } from 'fabric';

interface FeedbackBubbleProp {
  used: string;
  locX: number;
  locY: number;
  isCorrect: boolean;
}

class FeedbackBubble {
  private FeedbackBubble: fabric.Group;

  constructor({ used, locX, locY, isCorrect }: FeedbackBubbleProp) {
    const bubbleRect = new fabric.Rect({
      width: used === 'findAnimals' ? 300 : isCorrect ? 200 : 100,
      height: used === 'findAnimals' ? 60 : isCorrect ? 50 : 35,
      fill: isCorrect ? '#DDE2FB' : '#FFCED3',
      originX: 'center',
      originY: 'center',
    });

    // 피드백 버블 문구
    const bubbleText = new fabric.Text(
      isCorrect ? '정답입니다!' : '오답입니다!',
      {
        fontSize: used === 'findAnimals' ? 36 : isCorrect ? 30 : 15,
        fill: isCorrect ? '#0000FF' : '#E5001A',
        fontFamily: 'MaplestoryOTFBold',
        originX: 'center',
        originY: 'center',
      }
    );

    const bubbleGroup = new fabric.Group([bubbleRect, bubbleText], {
      top: locY,
      left: used === 'findAnimals' ? locX : isCorrect ? locX - 30 : locX,
    });

    this.FeedbackBubble = bubbleGroup;
  }

  render(): fabric.Group {
    return this.FeedbackBubble;
  }
}

export default FeedbackBubble;
