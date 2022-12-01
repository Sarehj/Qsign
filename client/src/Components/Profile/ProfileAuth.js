import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

const Profilen = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}1</h2>
        <p>{user.given_name} GIVEN</p>
        <p>{user.family_name} FAMILY</p>
        <p>{user.email}2</p>
        <p>{user.address}3</p>
        <p>{user.birthdate}4</p>
        <p>{user.gender}5</p>
        <p>{user.locale}6</p>
        <p>{user.nickname}7</p>
        <p>{user.phone_number}8</p>
        <p>{user.preferred_username}9</p>
        <p>{user.profile}10</p>
        <p>{user.sub}11</p>
        <p>{user.updated_at}12</p>
        <p>{user.zoneinfo}13</p>
        <p>{user.email_verified.toString()} HELLOOOO</p>
        
        
      </div>
    )
  );
};

export default Profilen;