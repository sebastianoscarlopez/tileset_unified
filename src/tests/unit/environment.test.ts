describe('Check enviroment variables', () => {
  it('should have a NODE_ENV variable', () => {
    expect(process.env.NODE_ENV).toBeDefined();
  });
  it('should have a NODE_PATH_IN_DIR variable', () => {
    expect(process.env.NODE_PATH_IN_DIR).toBeDefined();
  });
  it('should have a NODE_PATH_IN_ROOT variable', () => {
    expect(process.env.NODE_PATH_IN_ROOT).toBeDefined();
  });
  it('should have a NODE_PATH_OUT variable', () => {
    expect(process.env.NODE_PATH_OUT).toBeDefined();
  });
});
