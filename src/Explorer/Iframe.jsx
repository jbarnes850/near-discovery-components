State.init({ isLoaded: false });
const baseUrls = {
  mainnet: "https://explorer.near.org",
  testnet: "https://explorer.testnet.near.org",
};
const baseUrl = props.baseUrl || baseUrls[props.network || "testnet"] || baseUrls.testnet;
const query = { ...props.query, iframe: true };
const queryString = `?${Object.entries(query)
  .filter(([_key, value]) => value !== undefined && value !== null)
  .map(([key, value]) => `${key}=${value}`)
  .join("&")}`;
return (
  <>
    <div className={state.isLoaded ? "d-none" : undefined}>
      <span className="spinner-grow spinner-grow-sm me-1" role="status" aria-hidden="true" />
      Loading ...
    </div>
    <iframe
      className={["w-100", state.isLoaded ? undefined : "d-none"].filter((x) => !!x).join(" ")}
      style={style}
      src={`${baseUrl}/${props.url || ""}${queryString}`}
      iframeResizer={{
        onResized: () => State.update({ isLoaded: true }),
      }}
    />
  </>
);
