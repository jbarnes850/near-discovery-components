if (!props.src) return "";

State.init({
  copiedShareUrl: false,
});

const src = props.src;
const primaryAction = props.primaryAction || "viewDetails";
const [accountId, widget, widgetName] = src.split("/");
const data = Social.get(`${accountId}/widget/${widgetName}/metadata/**`);
const metadata = data || {};
const tags = Object.keys(metadata.tags || {});
const appUrl = `#/${src}`;
const detailsUrl = `#/${REPL_ACCOUNT}/widget/ComponentDetailsPage?src=${src}`;
const shareUrl = `https://${REPL_NEAR_URL}${detailsUrl}`;
const size = props.size || "large";
const componentDescMaxWords =  props.descMaxWords || 30;

if (props.showDesc && metadata.description) {
  const text = metadata.description.split(" ");
  metadata.description = text.slice(0, componentDescMaxWords);
  if (text.length >= componentDescMaxWords) {
    metadata.description.push("...");
  }
  metadata.description = metadata.description.join(" ");
}

const primaryActions = {
  open: {
    display: "Open",
    url: appUrl,
  },
  viewDetails: {
    display: "View Details",
    url: detailsUrl,
  },
};

const sizes = {
  medium: {
    gap: "16px",
    thumbnail: "56px",
    title: "16px",
  },
  large: {
    gap: "16px",
    thumbnail: "100px",
    title: "32px",
  },
};

const Wrapper = styled.div``;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => sizes[p.size].gap};
  margin-bottom: 32px;

  > * {
    min-width: 0;
  }

  @media (max-width: 770px) {
    gap: 16px;
  }
`;

const TagsWrapper = styled.div`
  margin-bottom: 16px;
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: ${(p) => sizes[p.size].title};
  line-height: 1.2em;
  color: #11181c;
  margin: 0 0 8px;
  font-weight: 600;

  @media (max-width: 770px) {
    font-size: 16px;
    margin: 0;
  }
`;

const Thumbnail = styled.div`
  width: ${(p) => sizes[p.size].thumbnail};
  height: ${(p) => sizes[p.size].thumbnail};
  flex-shrink: 0;
  border: 1px solid #eceef0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 1px 3px rgba(16, 24, 40, 0.1),
    0px 1px 2px rgba(16, 24, 40, 0.06);

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 770px) {
    width: 58px;
    height: 58px;
  }
`;

const sharedButtonStyles = `
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  height: 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }

  i {
    color: #7E868C;
  }

  .bi-16 {
    font-size: 16px;
  }
`;

const Button = styled.button`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => (p.primary ? "none" : "1px solid #D7DBDF")};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;

const ButtonLink = styled.a`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => (p.primary ? "none" : "1px solid #D7DBDF")};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${(p) => (p.bold ? "#11181C" : "#687076")};
  font-weight: ${(p) => (p.bold ? "600" : "400")};
  font-size: ${(p) => (p.small ? "12px" : "14px")};
  overflow: ${(p) => (p.ellipsis ? "hidden" : "visible")};
  text-overflow: ${(p) => (p.ellipsis ? "ellipsis" : "unset")};
  white-space: ${(p) => (p.ellipsis ? "nowrap" : "")};

  i {
    margin-right: 4px;
  }
`;

const votes = Social.index("vote", src);

const dataLoading = votes === null;
const votesByUsers = {};

(votes || []).forEach((vote) => {
  if (vote.value.type === "vote") {
    votesByUsers[vote.accountId] = vote;
  } else if (vote.value.type === "unvote") {
    delete votesByUsers[vote.accountId];
  }
});

if (state.hasVote === true) {
  votesByUsers[context.accountId] = {
    accountId: context.accountId,
  };
} else if (state.hasVote === false) {
  delete votesByUsers[context.accountId];
}

const accountsWithVotes = Object.keys(votesByUsers);
const voteCount = accountsWithVotes.length;
const hasVote = context.accountId && !!votesByUsers[context.accountId];

function checkNearConEventDate() {
  const today = new Date();
  const compareDate = new Date('2023-11-05T00:00:00');

  if (today >= compareDate) {
    return true
  } else {
    return false
  }
}

const showVoteButton = checkNearConEventDate()

const VoteButton = styled.div`
  line-height: 20px;
  min-height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: left;
  background: inherit;
  color: inherit;
  font-size: 16px;
  .icon {
    position: relative;
    &:before {
      margin: -8px;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 50%;
    }
  }

  .count {
    margin-left: 8px;
  }

  &:not([disabled]) {
    cursor: pointer;
  }

  &:not([disabled]):hover {
    opacity: 1 !important;

    .icon:before {
      background: rgba(255, 215, 0, 0.1);
    }
  }
  .upvoted {
    color: #FFD700;
  }

  .loading {
    @keyframes scaleAnimation {
     0%, 100% {
        transform: scale(1) rotate(0deg);
      }
      25% {
        transform: scale(1.2) rotate(-15deg);
      }
      50% {
        transform: scale(1) rotate(0deg);
      }
      75% {
        transform: scale(1.2) rotate(15deg);
      }
    }

    transform-origin: center;
    animation: scaleAnimation 1s ease-in-out infinite;
  }
`;

const voteClick = () => {
  if (state.loading || dataLoading || !context.accountId) {
    return;
  }
  State.update({
    loading: true,
  });
  const type = "vote";
  const data = {
    index: {
      vote: JSON.stringify({
        key: src,
        value: {
          type,
        },
      }),
      nearConAppQuest2023: JSON.stringify({
        key: src,
        value: {
          type,
        }
      })
    },
  };

  if (item.type === "social" && typeof item.path === "string") {
    const keys = item.path.split("/");
    if (keys.length > 0) {
      data.graph = {
        vote: {},
      };
      let root = data.graph.vote;
      keys.slice(0, -1).forEach((key) => {
        root = root[key] = {};
      });
      root[keys[keys.length - 1]] = hasVote ? null : "";
    }
  }

  if (!hasVote && props.notifyAccountId) {
    data.index.notify = JSON.stringify({
      key: props.notifyAccountId,
      value: {
        type,
        item,
      },
    });
  }
  Social.set(data, {
    onCommit: () => State.update({ loading: false, hasVote: !hasVote }),
    onCancel: () => State.update({ loading: false }),
  });
};

const title = "Vote";

const inner = (
  <div className="d-inline-flex align-items-center">
    <VoteButton
      disabled={state.loading || dataLoading || !context.accountId}
      title={title}
      onClick={voteClick}
    >
      <span
        className={`icon ${state.loading ? "loading " : ""}${hasVote ? "upvoted" : ""
          }`}
      >
        {hasVote ? <i class="bi bi-hand-thumbs-up-fill" /> : <i className="bi bi-hand-thumbs-up"></i>}
      </span>
    </VoteButton>
  </div>
);

return (
  <Wrapper>
    <Header size={size}>
      <Thumbnail size={size}>
        <Widget
          src="${REPL_MOB}/widget/Image"
          props={{
            image: metadata.image,
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreifc4burlk35hxom3klq4mysmslfirj7slueenbj7ddwg7pc6ixomu",
            alt: metadata.name,
          }}
        />
      </Thumbnail>

      <div>
        <Title size={size}>{metadata.name || widgetName}</Title>
        <Text ellipsis>{src}</Text>
      </div>
    </Header>

    {props.showDesc && (
      <div>
        {metadata.description ? (
          <Markdown text={metadata.description} />
        ) : (
          <Text>This component has no description.</Text>
        )}
      </div>
    )}

    {props.showTags && tags.length > 0 && (
      <TagsWrapper>
        <Widget
          src="${REPL_ACCOUNT}/widget/Tags"
          props={{
            tags,
          }}
        />
      </TagsWrapper>
    )}

    <Actions>
      <ButtonLink primary href={primaryActions[primaryAction].url}>
        {primaryActions[primaryAction].display}
      </ButtonLink>

      <ButtonLink href={`#/edit/${src}`}>
        {context.accountId === accountId ? (
          <>
            <i className="bi bi-pencil-fill"></i> Edit
          </>
        ) : (
          <>
            <i className="bi bi-git"></i> Fork
          </>
        )}
      </ButtonLink>

      <ButtonLink href={`${detailsUrl}&tab=source`}>
        <i className="bi bi-code-square"></i>
        View Source
      </ButtonLink>

      <OverlayTrigger
        placement="top"
        overlay={<Tooltip>Copy URL to clipboard</Tooltip>}
      >
        <Button
          type="button"
          onMouseLeave={() => {
            State.update({ copiedShareUrl: false });
          }}
          onClick={() => {
            clipboard.writeText(shareUrl).then(() => {
              State.update({ copiedShareUrl: true });
            });
          }}
        >
          {state.copiedShareUrl ? (
            <i className="bi bi-16 bi-check"></i>
          ) : (
            <i className="bi bi-16 bi-link-45deg"></i>
          )}
          Share
        </Button>
      </OverlayTrigger>
      {showVoteButton && <Button
        type="button"
        onClick={voteClick}
      >
        {inner}
        Upvote
        {context.accountId == accountId ? `(${voteCount})` : null}
      </Button>
      }

    </Actions>
  </Wrapper>
);
