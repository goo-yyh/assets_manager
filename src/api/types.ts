export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type ActionResult = {
  id: string;
  status: 'success';
  message: string;
};
