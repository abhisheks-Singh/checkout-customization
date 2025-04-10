import {
  reactExtension,
  Banner,
  BlockStack,
  Text,
  useApi,
  useTranslate,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension(
  "purchase.checkout.block.render",
  () => <Extension />
);

function Extension() {
  const translate = useTranslate();
  const { query, api } = useApi();
  const settings = useApi().settings.current;

  // if (error) return <Banner status="critical">{error}</Banner>;

  return (
    <>
      {settings.content_type === "info" ||
      settings.content_type === "success" ||
      settings.content_type === "warning" ||
      settings.content_type === "critical" ? (
        <Banner
          inlineAlignment={settings.alignment}
          spacing="loose"
          status={settings.content_type}
          title={settings.title}
          collapsible={settings.collapsible}
        >
          <Text size={settings.font_size} alignment={settings.alignment}>
            {settings.description}
          </Text>
        </Banner>
      ) : settings.content_type === "image" ? (
        <Image source={settings.image_url} alt={settings.title} />
      ) : settings.content_type === "static" ? (
        <BlockStack
          spacing="tight"
          inlineAlignment={settings.alignment}
          collapsible={settings.collapsible}
        >
          <Text size="medium">{settings.title}</Text>
          <Text
            size={settings.font_size}
            appearance={settings.appearance}
            emphasis={settings.appearance === "bold" ? "bold" : undefined}
          >
            {settings.description}
          </Text>
        </BlockStack>
      ) : (
        <Banner status="info">
          Please select a proper option to show static content.
        </Banner>
      )}
    </>
  );
}
