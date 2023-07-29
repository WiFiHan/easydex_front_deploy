export const DexBlock = ({ dex }) => {
  const onClickLike = () => {
    console.log("나도 좋아!");
    // add api call for liking post here
  };

  return (
    <div>
      <div className="imsisquare btn btn-ghost btn-circle">
        <div className="flex flex-wrap mt-5">
          this is dexBlock for dexID: {dex.id}
        </div>
        <div onClick={onClickLike}>You May Click Here for onClick Method</div>
      </div>
    </div>
  );
};
