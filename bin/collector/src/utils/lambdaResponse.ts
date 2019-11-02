const response = (body: string | any, statusCode = 200) => ({
  statusCode,
  body: typeof body === "string" ? JSON.stringify(body, null, 2) : body
});

export default response;
