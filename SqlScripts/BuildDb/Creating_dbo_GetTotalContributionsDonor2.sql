CREATE FUNCTION [dbo].[GetTotalContributionsDonor2]
(
	@fd DATETIME, 
	@td DATETIME,
	@campusid INT,
	@nontaxded BIT,
	@includeUnclosed BIT
)
RETURNS TABLE
AS
RETURN 
(
	WITH contributions AS ( 
		SELECT 
			CreditGiverId, 
			CreditGiverId2,
			HeadName, 
			SpouseName, 
			COUNT(*) AS [Count], 
			SUM(Amount) AS Amount, 
			SUM(PledgeAmount) AS PledgeAmount
		FROM dbo.Contributions2(@fd, @td, @campusid, NULL, @nontaxded, @includeUnclosed)
		GROUP BY CreditGiverId, CreditGiverId2, HeadName, SpouseName
	)
	SELECT 
		c.CreditGiverId, 
		c.CreditGiverId2,
		c.HeadName,
		c.SpouseName,
		c.[Count],
		c.Amount,
		c.PledgeAmount,
		MainFellowship = ISNULL(o.OrganizationName, ''), 
		MemberStatus = ms.[Description], 
		p.JoinDate, 
		p.SpouseId, 
		[Option] = op.[Description],
		Addr = p.PrimaryAddress,
		Addr2 = p.PrimaryAddress2,
		City = p.PrimaryCity,
		ST = p.PrimaryState,
		Zip = p.PrimaryZip
	FROM contributions c
	JOIN dbo.People p ON p.PeopleId = c.CreditGiverId
	JOIN lookup.MemberStatus ms ON p.MemberStatusId = ms.Id
	LEFT JOIN lookup.EnvelopeOption op ON op.Id = p.ContributionOptionsId
	LEFT OUTER JOIN dbo.Organizations o ON o.OrganizationId = p.BibleFellowshipClassId
)
GO
IF @@ERROR<>0 AND @@TRANCOUNT>0 ROLLBACK TRANSACTION
GO
IF @@TRANCOUNT=0 BEGIN INSERT INTO #tmpErrors (Error) SELECT 1 BEGIN TRANSACTION END
GO
