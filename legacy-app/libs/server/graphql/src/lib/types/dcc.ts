import * as DCC from '@pathcheck/dcc-sdk';
import { mutationField, nonNull, stringArg } from 'nexus';
import { CacheScope } from 'apollo-server-types';
import { DateTime } from 'luxon';

const CWT_ISSUER = 1;
const CWT_SUBJECT = 2;
const CWT_AUDIENCE = 3;
const CWT_EXPIRATION = 4;
const CWT_NOT_BEFORE = 5;
const CWT_ISSUED_AT = 6;

export const verifyDCCMutation = mutationField('verifyDCC', {
  type: 'Json',
  args: { certificate: nonNull(stringArg()) },
  resolve: async (source, { certificate }, context, info) => {
    info.cacheControl.setCacheHint({ maxAge: 600, scope: CacheScope.Private });

    const cwt = await DCC.unpackAndVerify(certificate);

    if (cwt) {
      const debugInfo = await DCC.debug(certificate);
      const payload = await DCC.parseCWT(cwt);

      let keyId = debugInfo.value[0].get
        ? debugInfo.value[0].get(4)
        : undefined;
      if (keyId === undefined) {
        keyId = debugInfo.value[1].get ? debugInfo.value[1].get(4) : undefined;
      }
      const signature = debugInfo.value[3];

      const cardType = payload.nam ? 'DCC' : 'UY';

      const cvtCWT = {
        iss: cwt.get(CWT_ISSUER),
        sub: cwt.get(CWT_SUBJECT),
        aud: cwt.get(CWT_AUDIENCE),
        exp: cwt.get(CWT_EXPIRATION),
        nbf: cwt.get(CWT_NOT_BEFORE),
        iat: cwt.get(CWT_ISSUED_AT),
        data: payload,
      };

      let test, vaccination, recovery;

      if (cvtCWT.data.t?.length) {
        const testCWT = cvtCWT.data.t[0];
        test = {
          type: testCWT.tt === 'LP6464-4' ? 'PCR' : 'Rapid test',
          country: testCWT.co,
          result: testCWT.tr === '260373001' ? 'Positive' : 'Negative',
          hours: Math.abs(
            Math.round(
              DateTime.fromISO(testCWT.sc).diffNow('hours').toObject().hours
            )
          ),
          date: new Date(testCWT.sc),
          relativeDate: DateTime.fromISO(testCWT.sc).toRelative(),
        };
      }

      if (cvtCWT.data.v?.length) {
        const vaxCWT = cvtCWT.data.v[0];
        vaccination = {
          doseNumber: vaxCWT.dn,
          series: vaxCWT.sd,
          date: new Date(vaxCWT.dt),
          country: vaxCWT.co,
          relativeDate: DateTime.fromISO(vaxCWT.dt).toRelative(),
        };
      }

      if (cvtCWT.data.r?.length) {
        const recoveryCWT = cvtCWT.data.r[0];
        recovery = {
          date: new Date(recoveryCWT.fr),
          validFrom: new Date(recoveryCWT.df),
          validUntil: new Date(recoveryCWT.du),
          country: recoveryCWT.co,
          relativeDate: DateTime.fromISO(recoveryCWT.fr).toRelative(),
          relativeFrom: DateTime.fromISO(recoveryCWT.df).toRelative(),
          relativeUntil: DateTime.fromISO(recoveryCWT.du).toRelative(),
        };
      }

      const baseCard = {
        format: 'DCC',
        type: cardType,
        pub_key: keyId,
        signature: signature,
        scanDate: new Date().toJSON(),
        verified: 'Valid',
        rawQR: certificate,
        cert: cvtCWT,
        name: `${cvtCWT.data.nam.gn} ${cvtCWT.data.nam.fn}`,
        test,
        vaccination,
        recovery,
      };
      return { status: 'OK', payload: baseCard };
    } else {
      return { status: 'Could not verify' };
    }
  },
});
