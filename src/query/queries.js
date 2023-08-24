// queries.js
import gql from 'graphql-tag';

export const RENDEZVOUS_FRAGMENT = gql`
  fragment rendezvousFr on Rendezvous {
    createdAt
    id
    inviteeId
    inviterId
    movieId
    room
    type
  }
`;

export const CALL_FRAGMENT = gql`
  fragment callFr on Call {
    calleeId
    callerId
    createdAt
    duration
    finishedAt
    id
    sessionId
    startedAt
    type
  }
`;

export const USER_PREVIEW_QUERY = gql`
  query UserPreview($asVIP: Boolean!) {
    userPreview(asVIP: $asVIP) {
      avatar {
        path
      }
      status {
        value
      }
      id
      phoneNumber
      firstname
      lastname
    }
  }
`;

export const IMAGE_FRAGMENT = gql`
  fragment imageFr on Image {
    eventId
    filename
    id
    originalFilename
    path
    rejectionReason
    relativeId
    sequence
    status
    userId
  }
`;

export const USER_FRAGMENT = gql`
  fragment userFr on User {
    aboutMe
    alcohol
    avatar {
      ...imageFr
    }
    birthday
    children
    city
    country
    datingPurpose
    education
    email
    eyes
    firstname
    gender
    geoLocation
    greeting
    hairs
    height
    id
    isOnline
    interests
    languages
    lastTimeDialogOnline
    lastname
    living
    maritalStatus
    physique
    position
    religion
    serials
    smoking
    specialization
    weight
  }
`;

export const GIFT_FRAGMENT = gql`
  fragment giftFr on Gift {
    amount
    currency
    filename
    id
    name
    type
  }
`;

export const USER_GIFT_FRAGMENT = gql`
  fragment userGiftFr on UserGift {
    gift {
      ...giftFr
    }
    giftId
    giverId
    id
    isShowOnProfile
    recipientId
  }
`;


export const MESSAGE_FRAGMENT = gql`
  fragment messageFr on Message {
    audio {
      filename
      id
      originalFilename
      path
      uploaderId
    }
    audioId
    call {
      ...callFr
    }
    callId
    companionHangUp
    createdAt
    dialog
    dialogType
    id
    image {
      ...imageFr
    }
    imageId
    isRead
    isRevealIdentity
    message
    ownerId
    owner {
      avatar {
        path
      }
      firstname
    }
    rendezvous {
      ...rendezvousFr
    }
    rendezvousId
    userGift {
      gift {
        name
        type
      }
      giftId
      giverId
      id
      recipientId
      isShowOnProfile
    }
    userGiftId
  }
  ${CALL_FRAGMENT}
  ${RENDEZVOUS_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;



export const DIALOG_FRAGMENT = gql`
  fragment dialogFr on Dialog {
    _companion
    companion {
      id
      firstname
      lastname
      lastTimeDialogOnline
      avatar {
        ...imageFr
      }
    }
    createdAt
    isBlocked
    lastMessage
    message {
      ...messageFr
    }
    rendezvousId
    token
    users
  }
  ${MESSAGE_FRAGMENT}
  ${IMAGE_FRAGMENT}
`;


export const DELETE_DIALOG_MUTATION = gql`
  mutation DeleteDialog($dialogToken: String!) {
    deleteDialog(dialogToken: $dialogToken)
  }
`;

export const INVITE_TO_RENDEZVOUS_MUTATION = gql`
  mutation InviteToRendezvous($input: InviteToRendezvousInput!) {
    inviteToRendezvous(input: $input) {
      ...rendezvousFr
    }
  }
`;

export const READ_MESSAGES_MUTATION = gql`
  mutation ReadMessages($messagesId: [Int!]!, $dialog: String!) {
    readMessages(messagesId: $messagesId, dialog: $dialog)
  }
`;

export const RENDEZVOUS_CHANGE_STATE_MUTATION = gql`
  mutation RendezvousChangeState($input: ChangeRendezvousStateInput!) {
    rendezvousChangeState(input: $input)
  }
`;

export const SEND_GIFT_MUTATION = gql`
  mutation SendGift($giftId: Int!, $recipientId: Int!) {
    sendGift(giftId: $giftId, recipientId: $recipientId) {
      ...userGiftFr
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessage($input: SendMessageInput!) {
    sendMessage(input: $input) {
      ...messageFr
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const SHOW_ON_PROFILE_MUTATION = gql`
  mutation ShowOnProfile($userGiftId: Int!) {
    showOnProfile(userGiftId: $userGiftId)
  }
`;

export const GET_DIALOG_BY_COMPANION_QUERY = gql`
  query GetDialogByCompanion($companion: Int!) {
    getDialogByCompanion(companion: $companion) {
      ...dialogFr
    }
  }
  ${DIALOG_FRAGMENT}
`;

export const GET_GIFTS_QUERY = gql`
  query GetGifts {
    getGifts {
      ...giftFr
    }
  }
`;

export const GET_MESSAGES_QUERY = gql`
  query GetMessages($page: Int, $size: Int, $dialog: String, $chatRoomId: Int) {
    getMessages(page: $page, size: $size, dialog: $dialog, chatRoomId: $chatRoomId) {
      ...messageFr
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const GET_MY_DIALOGS_QUERY = gql`
  query GetMyDialogs {
    getMyDialogs {
      ...dialogFr
    }
  }
  ${DIALOG_FRAGMENT}
`;

export const GET_USER_GIFT_QUERY = gql`
  query GetUserGift($userGiftId: Int!) {
    getUserGift(userGiftId: $userGiftId) {
      ...userGiftFr
    }
  }
`;

export const GET_CHAT_ROOMS_QUERY = gql`
  query GetChatRooms {
    getChatRooms {
      id
      description
      message {
        message
        owner {
          firstname
          avatar {
            path
          }
        }
      }
      picture
      title
      amountParticipants
      participants {
        avatar {
          path
        }
        id
        distance
        firstname
      }
    }
  }
`;

export const RECEIVE_MESSAGE_SUBSCRIPTION = gql`
  subscription ReceiveMessage {
    receiveMessage {
      ...messageFr
    }
  }
  ${MESSAGE_FRAGMENT}
`;

export const RENDEZVOUS_PROCESS_SUBSCRIPTION = gql`
  subscription RendezvousProcess($rendezvousId: Int!) {
    rendezvousProcess(rendezvousId: $rendezvousId) {
      state
    }
  }
`;

export const CHAT_ROOM_SUBSCRIPTION = gql`
  subscription ChatRoomSub($chatRoomId: Int!) {
    chatRoomSub(chatRoomId: $chatRoomId) {
      ...messageFr
    }
  }
`;


export const UPLOAD_IMAGE_MUTATION = gql`
  mutation UploadImage($input: SaveImageInput!) {
    uploadImage(input: $input) {
      eventId
      id
      path
      sequence
      status
    }
  }
`;

export const COMMENT_EVENT_MUTATION = gql`
  mutation CommentEvent($input: CommentEventInput!) {
    commentEvent(input: $input)
  }
`;

export const UPLOAD_AVATAR_MUTATION = gql`
  mutation UploadAvatar($input: SaveImageInput!) {
    uploadAvatar(input: $input) {
      eventId
      id
      path
      status
    }
  }
`;

export const CHANGE_IMAGE_ORDER_MUTATION = gql`
  mutation ChangeImageOrder($input: ChangeImageOrderInput!) {
    changeImageOrder(input: $input)
  }
`;

export const REMOVE_IMAGE_MUTATION = gql`
  mutation RemoveImage($id: Int!) {
    removeImage(id: $id)
  }
`;

export const SEND_IMAGE_MUTATION = gql`
  mutation SendImage($input: SendImageInput!) {
    sendImage(input: $input) {
      eventId
      id
      path
      sequence
      status
    }
  }
`;

const SEND_IMAGE_INPUT = gql`
  input SendImageInput {
    file: Upload!
    message: String
    """Companion id"""
    companion: Int
    dialogToken: String
    chatRoomId: Int
    inReply: Int
  }
`;
