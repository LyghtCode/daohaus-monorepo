import { BAAL_ABI, POSTER_ABI } from '@daohaus/contract-utilities';
import { utils } from 'ethers';
import {
  ArgType,
  CONTRACTS,
  encodeFunction,
  encodeValues,
  getNonce,
  isArray,
  isNumberish,
  isString,
  POSTER_TAGS,
  toBaseUnits,
  ValidNetwork,
} from '@daohaus/common-utilities';

import { FormValues } from '../types/form';
import { FORM_KEYS } from './formKeys';

const tokenConfigTX = (formValues: FormValues) => {
  const pauseVoteToken = !formValues.votingTransferable;
  const pauseNvToken = !formValues.votingTransferable;

  const encoded = encodeFunction(BAAL_ABI, 'setAdminConfig', [
    pauseVoteToken,
    pauseNvToken,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error('Encoding Error');
};

const governanceConfigTX = (formValues: FormValues) => {
  const {
    votingPeriodInSeconds,
    gracePeriodInSeconds,
    newOffering,
    quorum,
    sponsorThreshold,
    minRetention,
  } = formValues;

  if (
    !isNumberish(votingPeriodInSeconds) ||
    !isNumberish(gracePeriodInSeconds) ||
    !isNumberish(newOffering) ||
    !isNumberish(quorum) ||
    !isNumberish(sponsorThreshold) ||
    !isNumberish(minRetention)
  ) {
    throw new Error(
      'governanceConfigTX recieved arguments in the wrong shape or type'
    );
  }
  const encodedValues = encodeValues(
    ['uint32', 'uint32', 'uint256', 'uint256', 'uint256', 'uint256'],
    [
      votingPeriodInSeconds,
      gracePeriodInSeconds,
      utils.parseUnits(newOffering, 'ether').toString(),
      quorum,
      sponsorThreshold,
      minRetention,
    ]
  );
  const encoded = encodeFunction(BAAL_ABI, 'setGovernanceConfig', [
    encodedValues,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error('Encoding Error');
};

export const shamanConfigTX = (formValues: FormValues) => {
  const { shamans } = formValues;

  if (shamans === '' || !shamans) {
    const encoded = encodeFunction(BAAL_ABI, 'setShamans', [[], []]);
    if (isString(encoded)) {
      return encoded;
    }
    throw new Error('Encoding Error');
  }
  if (
    !isArray(shamans?.shamanAddresses) ||
    shamans.shamanAddresses.some((addr) => !isString(addr)) ||
    !isArray(shamans?.shamanPermissions) ||
    shamans.shamanPermissions.some((addr) => !isNumberish(addr))
  ) {
    console.error('ERROR: Form Values', formValues);
    throw new Error(
      'shamanConfigTX recieved arguments in the wrong shape or type'
    );
  }
  const encoded = encodeFunction(BAAL_ABI, 'setShamans', [
    shamans.shamanAddresses,
    shamans.shamanPermissions,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error('Encoding Error');
};

export const shareConfigTX = (formValues: FormValues) => {
  const { members } = formValues;
  if (
    !members ||
    !isArray(members?.memberAddresses) ||
    members.memberAddresses.some((addr) => !isString(addr)) ||
    !isArray(members?.memberShares) ||
    members.memberShares.some((shares) => !isNumberish(shares))
  ) {
    console.error('ERROR: Form Values', formValues);
    throw new Error(
      'shareConfigTX recieved arguments in the wrong shape or type'
    );
  }

  const wholeShareAmts = members.memberShares;
  const sharesInBaseUnits = wholeShareAmts.map((shares) => toBaseUnits(shares));
  const encoded = encodeFunction(BAAL_ABI, 'mintShares', [
    members.memberAddresses,
    sharesInBaseUnits,
  ]);

  if (isString(encoded)) {
    return encoded;
  }
  throw new Error('Encoding Error');
};

export const lootConfigTX = (formValues: FormValues) => {
  const { members } = formValues;

  if (
    !members ||
    !isArray(members?.memberAddresses) ||
    members.memberAddresses.some((addr) => !isString(addr)) ||
    !isArray(members?.memberShares) ||
    members.memberShares.some((shares) => !isNumberish(shares))
  ) {
    console.error('ERROR: Form Values', formValues);
    throw new Error(
      'shareConfigTX recieved arguments in the wrong shape or type'
    );
  }

  const wholeLootAmts = members.memberLoot;
  const lootInBaseUnits = wholeLootAmts.map((loot) =>
    toBaseUnits(loot.toString())
  );
  const encoded = encodeFunction(BAAL_ABI, 'mintLoot', [
    members.memberAddresses,
    lootInBaseUnits,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error('Encoding Error');
};

const metadataConfigTX = (formValues: FormValues, posterAddress: string) => {
  const { daoName } = formValues;
  if (!isString(daoName)) {
    console.error('ERROR: Form Values', formValues);
    throw new Error('metadataTX recieved arguments in the wrong shape or type');
  }

  const METADATA = encodeFunction(POSTER_ABI, 'post', [
    JSON.stringify({ name: daoName }),
    POSTER_TAGS.summoner,
  ]);

  const encoded = encodeFunction(BAAL_ABI, 'executeAsBaal', [
    posterAddress,
    0,
    METADATA,
  ]);
  if (isString(encoded)) {
    return encoded;
  }
  throw new Error('Encoding Error');
};

export const handleKeychains = (chainId: ValidNetwork) => {
  const { V3_FACTORY, POSTER } = CONTRACTS;
  const v3Contracts = [V3_FACTORY, POSTER];

  if (v3Contracts.every((contract) => contract[chainId])) {
    return {
      V3_FACTORY: V3_FACTORY[chainId] || '',
      POSTER: POSTER[chainId] || '',
    };
  }

  throw new Error('Could not find V3 contracts for this network');
};

export const assembleTxArgs = (
  formValues: Record<string, unknown>,
  chainId: ValidNetwork,
  safeAddress: string
): ArgType[] => {
  const tokenName = formValues[FORM_KEYS.TOKEN_NAME];
  const tokenSymbol = formValues[FORM_KEYS.TOKEN_SYMBOL];

  if (!isString(tokenName) || !isString(tokenSymbol)) {
    console.error('ERROR: Form Values', formValues);

    throw new Error(
      'assembleSummonTx recieved arguments in the wrong shape or type'
    );
  }

  const { POSTER } = handleKeychains(chainId);
  const initParams = encodeValues(
    ['string', 'string', 'address'],
    [tokenName, tokenSymbol, safeAddress]
  );
  const initActions = [
    tokenConfigTX(formValues),
    governanceConfigTX(formValues),
    shamanConfigTX(formValues),
    shareConfigTX(formValues),
    lootConfigTX(formValues),
    metadataConfigTX(formValues, POSTER),
  ];
  const args = [initParams, initActions, getNonce()];

  return args;
};