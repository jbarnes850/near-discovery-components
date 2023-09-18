const Card = styled.div`
  max-width: 592px;
  margin: 0 auto;
`;

// const isNotificationSupported = true;
// handleOnClick = () => {}
// TODO: solution to pass data to this component
// at this moment we don't have a simple solution to pass data to this component
// we are not able to detect if notifications are supported,
// and we are not able to handle Turn On button

return (
  <Card>
    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsHeader"
      props={{
        title: "Notification Settings",
        text: "Configure your notifications for activity on near.org",
      }}
    />

    {/* {isNotificationSupported && ( */}
    <Widget
      src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsListItem"
      props={{
        handleOnClick,
      }}
    />
    {/* )} */}
    {/* {isNotificationSupported || ( */}
    <Widget src="${REPL_ACCOUNT}/widget/NearOrg.Notifications.SettingsTurnOn" />
    {/* )} */}
  </Card>
);