export class CaptchaService {
  private static readonly OPERATORS = ["+", "-", "*"] as const;
  private static readonly MAX_NUMBER = 10;
  private static readonly MIN_NUMBER = 1;

  static generateChallenge(): { question: string; answer: number } {
    const num1 =
      Math.floor(Math.random() * (this.MAX_NUMBER - this.MIN_NUMBER + 1)) +
      this.MIN_NUMBER;
    const num2 =
      Math.floor(Math.random() * (this.MAX_NUMBER - this.MIN_NUMBER + 1)) +
      this.MIN_NUMBER;
    const operator =
      this.OPERATORS[Math.floor(Math.random() * this.OPERATORS.length)];

    let answer: number;
    switch (operator) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
    }

    const question = `What is ${num1} ${operator} ${num2}?`;
    return { question, answer };
  }

  static validateAnswer(
    userAnswer: string | number,
    correctAnswer: number,
  ): boolean {
    const parsedAnswer =
      typeof userAnswer === "string" ? parseInt(userAnswer, 10) : userAnswer;
    return !isNaN(parsedAnswer) && parsedAnswer === correctAnswer;
  }
}
