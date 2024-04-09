import _ from 'lodash';

export function getDomainFromRequest(request: Request) {
  let domain = `${_.get(request, 'protocol')}://${_.get(request, 'hostname')}`;
  const port: number | undefined = _.get(request, 'connection.localPort');

  const isLocal = domain.includes('localhost');

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (isLocal && port && port !== 80) {
    domain = `${domain}:${port}`;
  }

  return domain;
}
