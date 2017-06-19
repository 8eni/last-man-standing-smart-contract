function crcService($state) {

  return {
    title: () => $state.current.name
  }

}

export default crcService;
