const accountId = props.accountId ?? context.accountId;
if (!accountId) {
  return "No account ID";
}

State.init({
  selectedTab: props.tab || "overview",
});

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const profile = props.profile ?? Social.getr(`${accountId}/profile`);
const accountUrl = `/${REPL_ACCOUNT}/widget/ProfilePage?accountId=${accountId}`;

const starredComponentsData = Social.keys(`${accountId}/graph/star/*/widget/*`, "final", {
  return_type: "BlockHeight",
});
let starredComponents = null;
if (starredComponentsData) {
  starredComponents = [];
  const starredData = starredComponentsData[accountId]?.graph?.star ?? {};
  Object.keys(starredData).forEach((authorAccountId) => {
    Object.keys(starredData[authorAccountId].widget).forEach((componentName) => {
      starredComponents.push({
        accountId: authorAccountId,
        componentName,
      });
    });
  });
}
const starredComponentsCount = (starredComponents ?? []).length;

const Wrapper = styled.div``;

const Main = styled.div`
  display: grid;
  grid-template-columns: ${props.stack ? "minmax(0, 1fr)" : "min-content minmax(0, 1fr)"};
  gap: 40px;

  @media (max-width: 1024px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const BackgroundImage = styled.div`
  height: 240px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  margin: 0 -12px;
  background: #eceef0;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1024px) {
    margin: calc(var(--body-top-padding) * -1) -12px 0;
    border-radius: 0;
  }

  @media (max-width: 1024px) {
    height: 100px;
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 5;
  margin-top: -55px;
  min-width: 352px;

  @media (max-width: 1024px) {
    margin-top: -40px;
  }
`;

const Content = styled.div`
  .post {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: ${(p) => p.size || "25px"};
  line-height: 1.2em;
  color: #11181c;
  margin: ${(p) => (p.margin ? "0 0 24px" : "0")};
  overflow-wrap: anywhere;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 72px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1024px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 48px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled("Link")`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;
  white-space: nowrap;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

const Bio = styled.div`
  color: #11181c;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 48px;

  > *:last-child {
    margin-bottom: 0 !important;
  }

  @media (max-width: 900px) {
    margin-bottom: 48px;
  }
`;

const ContributionGraphWrapper = styled.div`
  margin: 0 0 48px;
`;

if (profile === null) {
  return "Loading";
}

const feeds = ["all"];
if (accountId !== context.accountId) {
  feeds.push("mutual");
}

return (
  <Wrapper className="gateway-page-container">
    <BackgroundImage>
      {profile.backgroundImage && (
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: profile.backgroundImage,
            alt: "profile background image",
            fallbackUrl: "https://ipfs.near.social/ipfs/bafkreibiyqabm3kl24gcb2oegb7pmwdi6wwrpui62iwb44l7uomnn3lhbi",
          }}
        />
      )}
    </BackgroundImage>

    <Main>
      <SidebarWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/ProfilePage.Sidebar"
          props={{
            accountId,
            profile,
          }}
        />
      </SidebarWrapper>

      <Content>
        <Tabs>
          <TabsButton href={`${accountUrl}&tab=overview`} selected={state.selectedTab === "overview"}>
            Overview
          </TabsButton>

          <TabsButton href={`${accountUrl}&tab=apps`} selected={state.selectedTab === "apps"}>
            Components
          </TabsButton>

          <TabsButton href={`${accountUrl}&tab=stars`} selected={state.selectedTab === "stars"}>
            Stars ({starredComponentsCount})
          </TabsButton>

          <TabsButton href={`${accountUrl}&tab=nfts`} selected={state.selectedTab === "nfts"}>
            NFTs
          </TabsButton>

          <TabsButton href={`${accountUrl}&tab=following`} selected={state.selectedTab === "following"}>
            Following
          </TabsButton>

          <TabsButton href={`${accountUrl}&tab=followers`} selected={state.selectedTab === "followers"}>
            Followers
          </TabsButton>
        </Tabs>

        {state.selectedTab === "overview" && (
          <>
            {profile.description && (
              <>
                <Title as="h2" size="19px" margin>
                  About
                </Title>

                <Bio>
                  <Widget src="${REPL_ACCOUNT}/widget/SocialMarkdown" props={{ text: profile.description }} />
                </Bio>
              </>
            )}

            <ContributionGraphWrapper>
              <Widget src="${REPL_ACCOUNT}/widget/DeveloperProfile.ContributionGraph" props={{ accountId }} />
            </ContributionGraphWrapper>

            <Widget
              src="${REPL_ACCOUNT}/widget/ActivityFeeds.DetermineActivityFeed"
              props={{
                filteredAccountIds: accountId,
                showCompose: false,
                feeds: feeds,
              }}
            />
          </>
        )}

        {state.selectedTab === "nfts" && <Widget src="${REPL_ACCOUNT}/widget/NFTCollection" props={{ accountId }} />}

        {state.selectedTab === "apps" && (
          <Widget src="${REPL_ACCOUNT}/widget/ComponentCollection" props={{ accountId }} />
        )}

        {state.selectedTab === "followers" && (
          <Widget src="${REPL_ACCOUNT}/widget/FollowersList" props={{ accountId }} />
        )}

        {state.selectedTab === "following" && (
          <Widget src="${REPL_ACCOUNT}/widget/FollowingList" props={{ accountId }} />
        )}

        {state.selectedTab === "stars" && (
          <Widget
            src="${REPL_ACCOUNT}/widget/ComponentCollection"
            props={{
              accountId,
              components: starredComponents,
              noDataText: "This account hasn't starred any components yet.",
            }}
          />
        )}
      </Content>
    </Main>
  </Wrapper>
);
