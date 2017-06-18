function metacoinService($state) {

  return {
    title: () => $state.current.name
  }

}

export default metacoinService;
