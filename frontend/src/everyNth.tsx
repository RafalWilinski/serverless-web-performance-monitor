export default (arr: any[], nth: number) => arr.filter((e, i) => i % nth === nth - 1);
