import { Card, Page, Text, Button, Box, Image } from '@shopify/polaris';
import checkoutWidgetImage from './assets/checkout-widget-upsells.webp';
import cartController from './assets/cart-controller.webp';
import image from './assets/image.webp';
import text from './assets/text.webp';

const widgets = [
  {
    id: 'upsells',
    title: 'Upsells',
    description: 'Increase your average order value by showing relevant product suggestions.',
    image: checkoutWidgetImage,
  },
  {
    id: 'cart-controls',
    title: 'Cart Controls',
    description: 'Give customers more flexibility with options like notes, gift wrap, or delivery instructions.',
    image: cartController,
  },
  {
    id: 'image',
    title: 'Images to Add',
    description: 'Add any custom image for assurance for customers',
    image: image,
  },
  {
    id: 'text',
    title: 'Add Custom text ',
    description: 'Motivate customers by showing Custom texts',
    image: text,
  }
];

export default function CheckoutPage() {
  return (
    <Page title="Checkout Widgets">
      <Box
        style={{
          display: 'flex',         // Use flex layout
          flexWrap: 'wrap',        // Enable wrapping for rows
          gap: '5px',             // Space between cards
          justifyContent: 'space-between', 
        }}
      >
        {widgets.map((widget) => (
          <Card
            key={widget.id}
            style={{
              width: '30%',         // Adjust width for better spacing
              boxSizing: 'border-box',
              marginBottom: '30px', // Ensure spacing between rows
            }}
          >
            <Box padding="16px" display="flex" flexDirection="column" alignItems="center" > 
              <Image source={widget.image} alt={`${widget.title} image`} width="274px" height="auto" />
              <Box paddingBlockStart="300" textAlign="center" style={{maxWidth: "230px"}}>
                <Text variant="headingMd" as="h2">
                  {widget.title}
                </Text>
                <Text variant="bodyMd" color="subdued">
                  {widget.description}
                </Text>
              </Box>
              <Box paddingBlockStart="300">
                <Button url={`/widgets/${widget.id}/edit`}>Edit {widget.title} Widget</Button>
              </Box>
            </Box>
          </Card>
        ))}
      </Box>
    </Page>
  );
}
