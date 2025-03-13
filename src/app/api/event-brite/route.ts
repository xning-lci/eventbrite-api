import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 90;

export type RequestDataType = {
  eventId: string;
  ticketId: string;
  quantity: number;
  email: string;
}

export const POST = async (req:NextRequest) => {
  const data = (await req.json()) as RequestDataType;
  // const EVENTBRITE_TOKEN = 'Q2EALS6QBSRSIVWHBTXT';
  const EVENTBRITE_TOKEN = 'S2HVZ243XB7DVA2GYY44';
  try {
    const ticketClasses = await fetch(`https://www.eventbriteapi.com/v3/events/${data.eventId}/ticket_classes/`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${EVENTBRITE_TOKEN}`
      }
    })
    const ticketClassesData = await ticketClasses.json();

    if(Object.keys(ticketClassesData).length > 0 && ticketClassesData?.ticket_classes?.length > 0) {
      const orderData = {
        event_id: data.eventId,
        ticket_classes: [{
          ticket_class_id: ticketClassesData?.ticket_classes[0],
          quantity: 1
        }],
        email: "buyer@example.com",
        first_name: "John",
        last_name: "Doe",
      };
      console.log('orderData', orderData)
      const orderResponse = await fetch("https://www.eventbriteapi.com/v3/orders/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EVENTBRITE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      const orderResponseData = await orderResponse.json();
      console.log('orderResponseData', orderResponseData)
      if (!orderResponse.ok) {
        return Response.json({ error: "无法获取活动数据" }, { status: orderResponse.status });
      }
      return NextResponse.json(orderResponseData, { status: 200 });
    } else {
      return NextResponse.json({ error: "无法获取活动数据" }, { status: ticketClasses.status });
    }

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
