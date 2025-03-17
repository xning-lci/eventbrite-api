import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 30;

export type RequestDataType = {
  orderId: string;
}

export const POST = async (req:NextRequest) => {
  const {orderId} = (await req.json()) as RequestDataType;
  console.log('orderId', orderId)
  const EVENTBRITE_TOKEN = 'Q2EALS6QBSRSIVWHBTXT';
  // const EVENTBRITE_TOKEN = 'S2HVZ243XB7DVA2GYY44';
  try {
    const url = `https://www.eventbriteapi.com/v3/orders/${orderId}/`;
    console.log('url', url)
    const orderDetail = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${EVENTBRITE_TOKEN}`,
          "Content-Type": "application/json"
        }
      })

      const orderDetailData = await orderDetail.json();
      console.log('orderDetailData', orderDetailData)
      if (!orderDetail.ok) {
        return Response.json({ error: "无法获取活动数据" }, { status: orderDetail.status });
      }
      return NextResponse.json(orderDetailData, { status: 200 });
  } catch (error) {
    console.error(`Get order API error.`, error)
    /*console.error(`Get order API error.
Request Body = ${JSON.stringify(obfuscateObject(wffmRequestData, ['FirstName', 'LastName', 'Email', 'Phone']))}
Response Body= ${JSON.stringify(wffmJsonResponse)}
Error = ${error}
`);*/
    return NextResponse.json({ message: 'Unable to send your request. Please try again.' }, { status: 500 });
  }
};
